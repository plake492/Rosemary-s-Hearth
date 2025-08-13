import React from 'react';

/**
 * A custom hook that tracks the match state of a media query.
 *
 * @param query The media query string to evaluate.
 * @returns A boolean indicating if the media query matches the current document state.
 */
export const useMatchMedia = (
  query: string = '(max-width: 768px)',
): boolean => {
  // Initialize state with current match status of the query
  const [matches, setMatches] = React.useState<boolean>(
    window.matchMedia(query).matches,
  );

  React.useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const documentChangeHandler = () => setMatches(mediaQueryList.matches);

    // Add listener for changes
    mediaQueryList.addEventListener('change', documentChangeHandler);

    // Remove listener on cleanup
    return () =>
      mediaQueryList.removeEventListener('change', documentChangeHandler);
  }, [query]);

  return matches;
};
