import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles, useTheme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import ToolBar from '@material-ui/core/ToolBar'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Posts from './Posts'
import SubredditPicker from './Picker'
import SubredditScopePicker from './SubredditScopePicker'
import Controls from './Controls'
import Title from './Title'
import Help from './Help'

const styles = ({ palette, spacing, shape }) => ({
  root: {
    position: 'fixed',
    left: 0,
    bottom: 0,
    padding: 0,
    paddingBottom: spacing(2),
    width: '100%',
    backgroundColor: palette.background.default,
    borderTop: '1px soild black',
    boxShadow: `-1px -4px 4px -4px ${palette.primary.dark}`,
    borderRadius: shape.borderRadius,
  },
})

const Menu = ({
  classes,
  post,
  menuRef,
}) => {
  const theme = useTheme()
  const largeScreen = useMediaQuery(theme.breakpoints.up('md'))
  return (
    <Container ref={menuRef} classes={classes} maxWidth={false}>
      <ToolBar stype={{ overflow: 'auto' }}>
        <SubredditPicker />
        <SubredditScopePicker />
        {largeScreen ? <Controls /> : ''}
      </ToolBar>
      {largeScreen ? '' : <ToolBar><Controls /></ToolBar>}
      <Posts />
      <ToolBar>
        <Title post={post} />
        <Help />
      </ToolBar>
    </Container>
  )
}

Menu.propTypes = {
  post: PropTypes.object,
  classes: PropTypes.object.isRequired,
  menuRef: PropTypes.object,
}

const mapStateToProps = state => {
  const { postsBySubreddit } = state
  const selectedPost = postsBySubreddit.cursor || {}

  return {
    post: selectedPost.post,
  }
}

export default Menu |> connect(mapStateToProps) |> withStyles(styles)
