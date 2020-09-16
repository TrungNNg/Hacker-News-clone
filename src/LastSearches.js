import React from 'react';
import {StyledPreviousSearchButton} from './styled'

const LastSearches = ({ lastSearches, onLastSearch }) => (
    <div style={{ marginBottom: "17px" }}>
      <p>Your previous search: </p>
      {lastSearches.map((searchTerm, index) => (
        <StyledPreviousSearchButton
          key={searchTerm + index}
          type="button"
          onClick={() => onLastSearch(searchTerm)}
        >
          {searchTerm}
        </StyledPreviousSearchButton>
      ))}
    </div>
  );

export default LastSearches;