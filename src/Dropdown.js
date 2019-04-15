import React from 'react'

const Dropdown = (props) => {
  return (
    <div>
      <label htmlFor={props.id}>{props.label}: </label>
      <select name={props.name} id={props.id}>
        <option value="test">Test</option>
      </select>
    </div>
  )
}

export default Dropdown