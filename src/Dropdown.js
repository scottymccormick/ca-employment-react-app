import React from 'react'

const Dropdown = (props) => {
  return (
    <div>
      <label htmlFor={props.id}>{props.label}: </label>
      <select name={props.name} id={props.id} 
        defaultValue={props.defaultValue}
        onChange={props.handleChange}>
        { props.data.map((entry) => {
          return (
            <option key={entry} value={entry}>{entry}</option>
          )
        }) }
      </select>
    </div>
  )
}

export default Dropdown