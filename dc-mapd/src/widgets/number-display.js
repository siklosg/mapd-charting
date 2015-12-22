/* ****************************************************************************
 * OVERRIDE: dc.numberDisplay                                                 *
 * ***************************************************************************/
dc.numberDisplay = function (parent, chartGroup) {
    var SPAN_CLASS = 'number-display';
    var _formatNumber = d3.format('.2s');
    var _chart = dc.baseMixin({});
    var _html = {one: '', some: '', none: ''};

    // dimension not required
    _chart._mandatoryAttributes(['group']);

    _chart.html = function (html) {
        if (!arguments.length) {
            return _html;
        }
        if (html.none) {
            _html.none = html.none;//if none available
        } else if (html.one) {
            _html.none = html.one;//if none not available use one
        } else if (html.some) {
            _html.none = html.some;//if none and one not available use some
        }
        if (html.one) {
            _html.one = html.one;//if one available
        } else if (html.some) {
            _html.one = html.some;//if one not available use some
        }
        if (html.some) {
            _html.some = html.some;//if some available
        } else if (html.one) {
            _html.some = html.one;//if some not available use one
        }
        return _chart;
    };

    _chart.value = function () {
        return _chart.data();
    };

/* OVERRIDE EXTEND ----------------------------------------------------------*/
    _chart.setDataAsync(function(group,callbacks) {
        group.value ? group.valueAsync(callbacks) : group.topAsync(1, undefined, callbacks);
    });
/* --------------------------------------------------------------------------*/

    _chart.data(function (group) {
        var valObj = group.value ? group.value() : group.top(1)[0];
        return _chart.valueAccessor()(valObj);
    });

    _chart.transitionDuration(250); // good default

    _chart._doRender = function () {
        var newValue = _chart.value(),
            span = _chart.selectAll('.' + SPAN_CLASS);

        if (span.empty()) {
            span = span.data([0])
                .enter()
                .append('span')
                .attr('class', SPAN_CLASS);
        }

        span.transition()
            .duration(_chart.transitionDuration())
            .ease('quad-out-in')
            .tween('text', function () {
                var interp = d3.interpolateNumber(this.lastValue || 0, newValue);
                this.lastValue = newValue;
                return function (t) {
                    var html = null, num = _chart.formatNumber()(interp(t));
                    if (newValue === 0 && (_html.none !== '')) {
                        html = _html.none;
                    } else if (newValue === 1 && (_html.one !== '')) {
                        html = _html.one;
                    } else if (_html.some !== '') {
                        html = _html.some;
                    }
                    this.innerHTML = html ? html.replace('%number', num) : num;
                };
            });
    };

    _chart._doRedraw = function () {
        return _chart._doRender();
    };

    _chart.formatNumber = function (formatter) {
        if (!arguments.length) {
            return _formatNumber;
        }
        _formatNumber = formatter;
        return _chart;
    };

    return _chart.anchor(parent, chartGroup);
};
/* ****************************************************************************
 * END OVERRIDE: dc.numberDisplay                                             *
 * ***************************************************************************/

