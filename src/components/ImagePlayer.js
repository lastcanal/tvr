import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import { nextPost, mediaFallback } from '../actions'

const styles = ({ palette }) => ({
  reactPlayer: {
    backgroundColor: 'black',
    zIndex: 40,
  },
  playerWrapper: {
    height: ({ height }) => (
      height
    ),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    top: 0,
    left: 0,
    backgroundColor: 'black',
    transform: 'translate3d(0,0,1px)',
  },
  error: {
    height: ({ height }) => (
      height
    ),
    backgroundColor: palette.background.default,
    top: 0,
    botton: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    zIndex: 40,
  },
  fallbackLink: {
    color: palette.text.primary,
    fontSize: 60,
    textDecoration: 'none',
  },

})

const ImagePlayer = ({
  height,
  post,
  isAutoAdvance,
  isMediaFallback,
  dispatch,
  classes,
}) => {

  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState(post.thumbnail)
  const [imgRef, setImgRef] = useState(null)
  const [imageWidth, setImageWidth] = useState(null)
  const [imageHeight, setImageHeight] = useState(height)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isAutoAdvance) dispatch(nextPost())
    }, 5000)

    return () => clearTimeout(timeout)
  }, [post, isAutoAdvance])

  const onLoad = () => {
    let decodedUrl = null
    if (post.preview?.enabled) {
      const parser = new DOMParser()
      const images = post.preview.images[0].resolutions
      const selectedImage = images.find((image) => image.height >= height) || {}
      const newUrl = selectedImage.url || images[images.length - 1]?.url
      if (newUrl) {
        decodedUrl = parser.parseFromString(newUrl, 'text/html')
          .body.textContent
      }
    }

    const target = decodedUrl || post.url

    setUrl(target)
  }

  const onError = (error) => {
    setLoading(false)
    dispatch(mediaFallback(error))
  }

  const onImageChange = () => {
    if (!imgRef) return
    setLoading(false)

    const width = window.innerWidth
    if (imgRef.width > width) {
      setImageWidth(width)
      setImageHeight(null)
    } else if (imgRef.height / height) {
      setImageWidth(null)
      setImageHeight(height)
    } else if (imgRef.height / imgRef.width >= height / width) {
      setImageWidth(width)
      setImageHeight(null)
    } else {
      setImageWidth(null)
      setImageHeight(height)
    }
  }

  useEffect(() => {
    setLoading(true)
    onLoad()
  }, [post])

  useEffect(() => {
    onImageChange()
  }, [height])

  if (isMediaFallback) {
    return <div className={classes.error}>
      <h2>  Loading Embedded Image </h2>
      <a className={classes.fallbackLink} href={post.url}>
        Direct Link
      </a>
      <h5>via { post.domain }</h5>
    </div>
  }

  return <div className={classes.playerWrapper}>
    <img
      ref={setImgRef}
      src={url}
      height={imageHeight}
      width={imageWidth}
      style={{
        opacity: loading ? 0.5 : 1,
        transition: 'opacity 1s',
      }}
      onLoad={onImageChange}
      onError={onError}
    />
  </div>
}

ImagePlayer.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
  error: PropTypes.object,
  isFetching: PropTypes.bool,
  isMediaFallback: PropTypes.bool,
  isAutoAdvance: PropTypes.bool,
  height: PropTypes.number,
  post: PropTypes.object,
}

const mapStateToProps = state => {
  const { dispatch, selectedSubreddit, postsBySubreddit, config } = state
  const { isFullsceen, isAutoAdvance } = config
  const selectedPost = postsBySubreddit.cursor || {}
  const { isFetching } = postsBySubreddit[selectedSubreddit] || {
    isFetching: false,
  }

  return {
    dispatch,
    isFetching,
    post: selectedPost.post,
    isMediaFallback: selectedPost.media_fallback,
    isFullsceen,
    isAutoAdvance,
  }
}

export default ImagePlayer |> connect(mapStateToProps) |> withStyles(styles)

