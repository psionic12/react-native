/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

import type {TypeAliasResolutionStatus, TypeDeclarationMap} from '../utils';

/**
 * This FlowFixMe is supposed to refer to an InterfaceDeclaration or TypeAlias
 * declaration type. Unfortunately, we don't have those types, because flow-parser
 * generates them, and flow-parser is not type-safe. In the future, we should find
 * a way to get these types from our flow parser library.
 *
 * TODO(T71778680): Flow type AST Nodes
 */

function getTypes(ast: $FlowFixMe): TypeDeclarationMap {
  return ast.body.reduce((types, node) => {
    if (node.type === 'ExportNamedDeclaration' && node.exportKind === 'type') {
      if (
        node.declaration != null &&
        (node.declaration.type === 'TypeAlias' ||
          node.declaration.type === 'InterfaceDeclaration')
      ) {
        types[node.declaration.id.name] = node.declaration;
      }
    } else if (
      node.type === 'ExportNamedDeclaration' &&
      node.exportKind === 'value' &&
      node.declaration &&
      node.declaration.type === 'EnumDeclaration'
    ) {
      types[node.declaration.id.name] = node.declaration;
    } else if (
      node.type === 'TypeAlias' ||
      node.type === 'InterfaceDeclaration' ||
      node.type === 'EnumDeclaration'
    ) {
      types[node.id.name] = node;
    }
    return types;
  }, {});
}

// $FlowFixMe[unclear-type] there's no flowtype for ASTs
export type ASTNode = Object;

const invariant = require('invariant');

function resolveTypeAnnotation(
  // TODO(T71778680): This is an Flow TypeAnnotation. Flow-type this
  typeAnnotation: $FlowFixMe,
  types: TypeDeclarationMap,
): {
  nullable: boolean,
  typeAnnotation: $FlowFixMe,
  typeAliasResolutionStatus: TypeAliasResolutionStatus,
} {
  invariant(
    typeAnnotation != null,
    'resolveTypeAnnotation(): typeAnnotation cannot be null',
  );

  let node = typeAnnotation;
  let nullable = false;
  let typeAliasResolutionStatus: TypeAliasResolutionStatus = {
    successful: false,
  };

  for (;;) {
    if (node.type === 'NullableTypeAnnotation') {
      nullable = true;
      node = node.typeAnnotation;
    } else if (node.type === 'GenericTypeAnnotation') {
      typeAliasResolutionStatus = {
        successful: true,
        aliasName: node.id.name,
      };
      const resolvedTypeAnnotation = types[node.id.name];
      if (
        resolvedTypeAnnotation == null ||
        resolvedTypeAnnotation.type === 'EnumDeclaration'
      ) {
        break;
      }

      invariant(
        resolvedTypeAnnotation.type === 'TypeAlias',
        `GenericTypeAnnotation '${node.id.name}' must resolve to a TypeAlias. Instead, it resolved to a '${resolvedTypeAnnotation.type}'`,
      );

      node = resolvedTypeAnnotation.right;
    } else {
      break;
    }
  }

  return {
    nullable: nullable,
    typeAnnotation: node,
    typeAliasResolutionStatus,
  };
}

function getValueFromTypes(value: ASTNode, types: TypeDeclarationMap): ASTNode {
  if (value.type === 'GenericTypeAnnotation' && types[value.id.name]) {
    return getValueFromTypes(types[value.id.name].right, types);
  }
  return value;
}

// TODO(T71778680): Flow-type ASTNodes.
function isModuleRegistryCall(node: $FlowFixMe): boolean {
  if (node.type !== 'CallExpression') {
    return false;
  }

  const callExpression = node;

  if (callExpression.callee.type !== 'MemberExpression') {
    return false;
  }

  const memberExpression = callExpression.callee;
  if (
    !(
      memberExpression.object.type === 'Identifier' &&
      memberExpression.object.name === 'TurboModuleRegistry'
    )
  ) {
    return false;
  }

  if (
    !(
      memberExpression.property.type === 'Identifier' &&
      (memberExpression.property.name === 'get' ||
        memberExpression.property.name === 'getEnforcing')
    )
  ) {
    return false;
  }

  if (memberExpression.computed) {
    return false;
  }

  return true;
}

module.exports = {
  getValueFromTypes,
  resolveTypeAnnotation,
  getTypes,
  isModuleRegistryCall,
};
