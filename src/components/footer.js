import React from 'react'
import PropTypes from 'prop-types'

const Footer = ({ copyrights }) => (
  <footer>
    {copyrights ? (
      <div
        dangerouslySetInnerHTML={{
          __html: copyrights,
        }}
      />
    ) : (
      <>
        <span className="footerCopyrights">
          © 2020 Built with <a href="https://www.gatsbyjs.org" target="_blank">Gatsby</a> and theme by <a href="https://github.com/panr/gatsby-starter-hello-friend" target="_blank">Panr</a>
        </span>
        <span className="footerCopyrights">
          Github <a href="https://github.com/mecitsemerci" target="_blank">Profile</a>
        </span>
      </>
    )}
  </footer>
)

Footer.propTypes = {
  copyrights: PropTypes.string,
}

export default Footer
