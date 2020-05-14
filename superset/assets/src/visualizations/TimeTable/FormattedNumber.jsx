import React from 'react';
import PropTypes from 'prop-types';
import { formatNumber } from '@superset-ui/number-format';

import { _formatNumber } from '../../modules/utils';

const propTypes = {
  num: PropTypes.number,
  format: PropTypes.string,
};

const defaultProps = {
  num: 0,
  format: undefined,
};

function FormattedNumber({ num, format }) {
  if (format) {
    return (
      <span title={num}>{_formatNumber(format, num)}</span>
    );
  }
  return <span>{num}</span>;
}

FormattedNumber.propTypes = propTypes;
FormattedNumber.defaultProps = defaultProps;

export default FormattedNumber;