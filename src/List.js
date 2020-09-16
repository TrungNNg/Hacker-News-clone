import React,{useState} from 'react';
import {StyledButtonSmall, StyledItem, StyledColumn} from './styled'
import {sortBy} from 'lodash';

const SORTS = {
    NONE: list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list => sortBy(list, 'author'),
    COMMENT: list => sortBy(list, 'num_comments').reverse(),
    POINT: list => sortBy(list, 'points').reverse(),
  };

const List = ({ list, onRemoveItem }) => {
    const [sort, setSort] = useState({sortKey: 'NONE', isReverse: false});
  
    const handleSort = sortKey => {
      const isReverse = sort.sortKey === sortKey && !sort.isReverse;
   
      setSort({ sortKey, isReverse });
    };
   
    const sortFunction = SORTS[sort.sortKey];
    const sortedList = sort.isReverse
      ? sortFunction(list).reverse()
      : sortFunction(list);
  
    return (
      <div>
        <div style={{ display: "flex" }}>
          <span style={{ width: "40%" }}>
            <StyledButtonSmall type="button" onClick={() => handleSort("TITLE")}>
              Title
            </StyledButtonSmall>
          </span>
          <span style={{ width: "30%" }}>
            <StyledButtonSmall type="button" onClick={() => handleSort("AUTHOR")}>
              Author
            </StyledButtonSmall>
          </span>
          <span style={{ width: "10%" }}>
            <StyledButtonSmall type="button" onClick={() => handleSort("COMMENT")}>
              Comments
            </StyledButtonSmall>
          </span>
          <span style={{ width: "10%" }}>
            <StyledButtonSmall type="button" onClick={() => handleSort("POINT")}>
              Points
            </StyledButtonSmall>
          </span>
          <span style={{ width: "10%" }}>Actions</span>
        </div>
  
        {sortedList.map(item => (
          <Item
            key={item.objectID}
            item={item}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </div>
    );
  };
  
  const Item = ({ item, onRemoveItem }) => (
    <StyledItem>
      <StyledColumn width="40%">
        <a href={item.url}>{item.title}</a>
      </StyledColumn>
      <StyledColumn width="30%">{item.author}</StyledColumn>
      <StyledColumn width="10%">{item.num_comments}</StyledColumn>
      <StyledColumn width="10%">{item.points}</StyledColumn>
      <StyledColumn width="10%">
        <StyledButtonSmall type="button" onClick={() => onRemoveItem(item)}>
          Dismiss
        </StyledButtonSmall>
      </StyledColumn>
    </StyledItem>
  );

  export default List;