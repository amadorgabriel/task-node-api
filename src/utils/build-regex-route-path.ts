export function buildRegexRoutePath(path: string) {
  const routeParamsRegexPattern = /:([a-zA-Z]+)/g;
  const paramsWithRegex = path.replace(
    routeParamsRegexPattern,
    "(?<$1>[a-z0-9-_]+)"
  );

  const regexWithQueryParameters = new RegExp(
    `^${paramsWithRegex}(?<query>\\?(.*))?$`
  );

  return regexWithQueryParameters;
}
