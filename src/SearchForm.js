import React from 'react';
import {StyledSearchForm, StyledButtonLarge} from './styled';
import InputWithLabel from './InputWithLabel';

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => (
    <StyledSearchForm onSubmit={onSearchSubmit}>
      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={onSearchInput}
      >
        <strong>Search:</strong>
      </InputWithLabel>
  
      <StyledButtonLarge type="submit" disabled={!searchTerm}>
        Submit
      </StyledButtonLarge>
    </StyledSearchForm>
  );

export default SearchForm;