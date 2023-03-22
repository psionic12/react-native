import React, {PureComponent} from 'react';
import {
    View,
    ScrollView,
    Animated
} from 'react-native';
import Cell from './cell';


class RNTesterAppShared extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selected: false,
            data: Array.from({ length: 10 }).map((_, index) => index),
            scrollY: 0,
        };
    }
    showExample(exampleName) {
        // const res = await Ext.open(exampleName);
    }

    // render test: return lots of complicated Pressable components
    renderTest() {
        const arr = [];
        for (let i = 0; i < 10; i++) {
            arr.push();
        }
        return arr;
    }

    loadMoreData() {
        const { data } = this.state;
        const newData = data.concat(Array.from({ length: 1 }).map((_, index) => index + data.length));
        this.setState({ data: newData });
    }

    isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
      console.log(layoutMeasurement, contentOffset, contentSize);
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView
                    scrollEventThrottle={16}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }])}
                    onMomentumScrollEnd={({ nativeEvent }) => {
                        if (this.isCloseToBottom(nativeEvent)) {
                            this.loadMoreData();
                        }
                    }}
                    style={{
                        flexGrow: 1,
                        flexShrink: 1,
                        backgroundColor: '#f6f7f8'}}>
                    {this.state.data.map((_, index) => (
                        <Cell idx={index} onMyPress={() => this.showExample('ErrorCase')} />
                    ))}
                </ScrollView>
            </View>
        );
    }
}

export default RNTesterAppShared;
