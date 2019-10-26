import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { IconButton } from '@material-ui/core'

import SkipNextIcon from '@material-ui/icons/SkipNext'
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious'
import RefreshIcon from '@material-ui/icons/Refresh'
import FullscreenIcon from '@material-ui/icons/Fullscreen'
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit'
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'

import {
  fetchPostsIfNeeded,
  invalidateSubreddit,
  nextPost,
  previousPost,
} from '../actions'

const useStyles = makeStyles(({ spacing }) => ({
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: spacing(1),
  },
  playIcon: {
    height: spacing(3),
    width: spacing(3),
  },
}))
const Controls = ({ dispatch, posts, selectedSubreddit }) => {
  const isFullScreen = true
  const isAutoplaying = true
  const handleRefreshClick = e => {
    e.preventDefault()
    dispatch(invalidateSubreddit(selectedSubreddit))
    dispatch(fetchPostsIfNeeded(selectedSubreddit))
  }

  const handleNextClick = e => {
    e.preventDefault()
    dispatch(nextPost(posts))
  }

  const handlePreviousClick = e => {
    e.preventDefault()
    dispatch(previousPost(posts))
  }

  const classes = useStyles()

  return (
    <div className={classes.controls}>
      <IconButton aria-label="fullscreen" color="inherit">
        {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </IconButton>
      <IconButton
        aria-label="refresh"
        color="inherit"
        onClick={handleRefreshClick}
      >
        <RefreshIcon />
      </IconButton>
      <IconButton aria-label="autoplay" color="inherit">
        {isAutoplaying ? <PlayCircleFilledWhiteIcon /> : <PlayCircleOutlineIcon />}
      </IconButton>
      <IconButton
        aria-label="previous"
        color="inherit"
        onClick={handlePreviousClick}
      >
        <SkipPreviousIcon />
      </IconButton>
      <IconButton aria-label="next" color="inherit" onClick={handleNextClick}>
        <SkipNextIcon />
      </IconButton>
    </div>
  )
}

Controls.propTypes = {
  dispatch: PropTypes.func.isRequired,
  posts: PropTypes.array,
  selectedSubreddit: PropTypes.string,
}

export default Controls
