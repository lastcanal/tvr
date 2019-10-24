import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import CreatableSelect from 'react-select/creatable'
import Option from './Option'

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    margin: spacing(2),
  },
}))

const nameToOption = (name) => ({
  value: name.toLowerCase(), label: name,
})

const Picker = ({ value, options, onChange }) => {
  const classes = useStyles()

  const mappedOptions = useMemo(() => (
    options.map(nameToOption)
  ), [options])

  const mappedValue = useMemo(() => (
    value ? nameToOption(value) : ''
  ), [value])

  return (
    <span className={classes.container}>
      <CreatableSelect
        isClearable
        defaultValue={mappedValue}
        onChange={onChange}
        options={mappedOptions}
        components={{
          Option: Option,
        }}
      />
    </span>
  )
}

Picker.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

export default Picker
