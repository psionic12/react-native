// cell 组件
import styles from './styles';
import React, { Component, PureComponent } from 'react';
import { Text, View, Pressable } from 'react-native';

export default class Cell extends PureComponent {
    state = {
        selected: false,
    };

    handlePress = (e) => {
        const { selected } = this.state;
        const { onMyPress } = this.props;
        onMyPress && onMyPress(e);
        this.setState({ selected: !selected });
    };

    render() {
        const { idx } = this.props;
        return (
            <Pressable style={styles.listRow} onPress={(e) => this.handlePress(e)}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: this.state.selected ? 'red' : 'white',
                    }}>
                    <Text style={styles.listRowText}>Comment</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {/* create lots of Text components */}
                        {Array.from({ length: 1 }).map((_, index) => (
                            <Text key={index} style={styles.listRowText}>
                                {idx + '' + index}
                            </Text>
                        ))}
                    </View>
                </View>
            </Pressable>
        );
    }
}
