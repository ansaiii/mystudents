/**
 * 代替JSX中的三目运算和条件判断，提升开发体验
 * @param when - 条件
 * @param fallback - 未满足条件时的展示内容
 * @param children - 满足条件时的展示内容
 * @returns 满足条件时展示children，否则展示fallback
 * @example
 * <Show when={condition} fallback={<div>未满足条件时的展示内容</div>}>
 *  <div>满足条件时的展示内容</div>
 * </Show>
 */
type ShowProps = {
  when: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
};
const Show: React.FC<ShowProps> = ({
  when,
  fallback,
  children,
}) => {
  return when ? children : fallback;
};

export default Show;