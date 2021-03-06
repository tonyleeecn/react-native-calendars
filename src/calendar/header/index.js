import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import XDate from 'xdate';
import PropTypes from 'prop-types';
import styleConstructor from './style';
// import { weekDayNames } from '../../dateutils';

class CalendarHeader extends Component {
  static propTypes = {
    theme: PropTypes.object,
    hideArrows: PropTypes.bool,
    month: PropTypes.instanceOf(XDate),
    addMonth: PropTypes.func,
    showIndicator: PropTypes.bool,
    firstDay: PropTypes.number,
    renderArrow: PropTypes.func,
    hideDayNames: PropTypes.bool,
    weekNumbers: PropTypes.bool,
    onPressArrowLeft: PropTypes.func,
    onPressArrowRight: PropTypes.func,
    weekDayNames: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    weekDayNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.addMonth = this.addMonth.bind(this);
    this.substractMonth = this.substractMonth.bind(this);
    this.onPressLeft = this.onPressLeft.bind(this);
    this.onPressRight = this.onPressRight.bind(this);
  }

  addMonth() {
    this.props.addMonth(1);
  }

  substractMonth() {
    this.props.addMonth(-1);
  }

  shouldComponentUpdate(nextProps) {
    if (
      nextProps.month.toString('yyyy MM') !==
      this.props.month.toString('yyyy MM')
    ) {
      return true;
    }
    if (nextProps.showIndicator !== this.props.showIndicator) {
      return true;
    }
    if (nextProps.hideDayNames !== this.props.hideDayNames) {
      return true;
    }
    return false;
  }

  onPressLeft() {
    const { onPressArrowLeft } = this.props;
    if (typeof onPressArrowLeft === 'function') {
      return onPressArrowLeft(this.substractMonth);
    }
    return this.substractMonth();
  }

  onPressRight() {
    const { onPressArrowRight } = this.props;
    if (typeof onPressArrowRight === 'function') {
      return onPressArrowRight(this.substractMonth);
    }
    return this.addMonth();
  }

  getWeekDayNames = (firstDayOfWeek = 0) => {
    let names = this.props.weekDayNames;
    const dayShift = firstDayOfWeek % 7;
    if (dayShift) {
      names = names.slice(dayShift).concat(names.slice(0, dayShift));
    }
    return names;
  };

  render() {
    let leftArrow = <View />;
    let rightArrow = <View />;
    let weekDaysNames = this.getWeekDayNames(this.props.firstDay);

    if (!this.props.hideArrows) {
      leftArrow = (
        <TouchableOpacity onPress={this.onPressLeft} style={this.style.arrow}>
          {this.props.renderArrow ? (
            this.props.renderArrow('left')
          ) : (
            <Image
              source={require('../img/previous.png')}
              style={this.style.arrowImage}
            />
          )}
        </TouchableOpacity>
      );
      rightArrow = (
        <TouchableOpacity onPress={this.onPressRight} style={this.style.arrow}>
          {this.props.renderArrow ? (
            this.props.renderArrow('right')
          ) : (
            <Image
              source={require('../img/next.png')}
              style={this.style.arrowImage}
            />
          )}
        </TouchableOpacity>
      );
    }
    let indicator;
    if (this.props.showIndicator) {
      indicator = <ActivityIndicator />;
    }
    return (
      <View>
        <View style={this.style.header}>
          {leftArrow}
          <View
            style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}
          >
            <Text allowFontScaling={false} style={this.style.monthText}>
              {this.props.month.toString(
                this.props.monthFormat ? this.props.monthFormat : 'MMMM yyyy'
              )}
            </Text>
            {indicator}
          </View>
          {rightArrow}
        </View>
        {!this.props.hideDayNames && (
          <View style={this.style.week}>
            {this.props.weekNumbers && (
              <Text allowFontScaling={false} style={this.style.dayHeader} />
            )}
            {weekDaysNames.map((day, idx) => (
              <Text
                allowFontScaling={false}
                key={idx}
                style={this.style.dayHeader}
                numberOfLines={1}
              >
                {day}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  }
}

export default CalendarHeader;
