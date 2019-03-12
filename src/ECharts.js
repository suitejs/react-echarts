import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';

import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import { isSeriesOption } from './utils';
import './theme/rsuite_light';

const defaultOption = {
  grid: {
    containLabel: true
  }
};

// ECharts with empty message and loading
class ECharts extends Component {
  static propTypes = {
    height: PropTypes.number,
    option: PropTypes.object,
    locale: PropTypes.shape({
      emptyMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      loading: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
    })
  };

  static defaultProps = {
    height: 300,
    locale: {
      emptyMessage: 'No data found',
      loading: 'Loading...'
    },
    option: {}
  };

  static childContextTypes = {
    setChartOption: PropTypes.func,
    series: PropTypes.arrayOf(PropTypes.object)
  };

  constructor(props) {
    super(props);

    const { option } = this.props;
    this.state = {
      option: {
        ...option,
        grid: {
          ...defaultOption.grid,
          ...option.grid
        }
      }
    };
  }

  getChildContext() {
    const { children } = this.props;
    return {
      setChartOption: this.setOption,
      series: Children.toArray(children).filter(comp => isSeriesOption(comp))
    };
  }

  setOption = func => this.setState(({ option }) => ({ option: func(option) }));

  bindEChartsRef = ref => {
    this.echarts = ref && ref.getEchartsInstance();
  };

  renderEmptyMessage() {
    const { locale } = this.props;
    return (
      <div
        className="rs-echarts-body-info"
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {locale.emptyMessage}
      </div>
    );
  }

  render() {
    const {
      height,
      className,
      style,
      children,
      option: optionFromProps,
      ...echartsForReactProps
    } = this.props;
    const { option } = this.state;
    const dataEmpty =
      !option.series ||
      option.series.reduce((empty, serie) => empty && (!serie.data || serie.data.length < 1), true);

    return (
      <div className={`rs-echarts ${className || ''}`} style={{ height, ...style }}>
        {dataEmpty ? (
          this.renderEmptyMessage()
        ) : (
          <ReactEchartsCore
            echarts={echarts}
            option={option}
            style={{ height: '100%' }}
            ref={this.bindEChartsRef}
            notMerge
            theme="rsuite_light"
            {...echartsForReactProps}
          />
        )}
        {children}
      </div>
    );
  }
}

export default ECharts;
