const customMediaQuery = (maxWidth: number) =>
  `@media (max-width: ${maxWidth}px)`;

const media = {
  custom: customMediaQuery,
  desktop: `@media (min-width: 922px)`,
  tablet: customMediaQuery(768),
  phone: customMediaQuery(576),
};

export default media;
