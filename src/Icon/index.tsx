import classNames from 'classnames';
import './index.less';

const classNamePrefix = 'yidooO';
interface IconProps {
  symbolPrefix?: string;
  symbol?: string;

  className?: string;

  color?: string;
  style?: React.CSSProperties;

  width?: string | number;

  height?: string | number;

  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
}

const SymbolPrefix = 'IconSVG';

const Icon: React.FC<IconProps> = props => {
  const {
    symbol,
    className,
    width = '1em',
    height = '1em',
    color,
    symbolPrefix = SymbolPrefix,
    disabled,
    ...restProps
  } = props;
  const iconClass = classNames(
    `${classNamePrefix}-icon`,
    [`${classNamePrefix}-icon`, symbol].join('-'),
    className,
  );

  if (!symbol) return null;
  const symbolId = symbolPrefix ? `#${[symbolPrefix, symbol].join('-')}` : `#${symbol}`;
  return (
    <i
      {...restProps}
      className={classNames(iconClass, disabled && 'disabled')}
      style={{
        width,
        height,
      }}
    >
      <svg
        width={width}
        height={height}
        fill={color ?? 'currentColor'}
        aria-hidden="true"
        focusable="false"
      >
        <use xlinkHref={symbolId} />
      </svg>
    </i>
  );
};

export { Icon, SymbolPrefix, type IconProps };
