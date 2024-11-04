import React from 'react';

const Footer: React.FC = () => {

  function getYear() {
    return new Date().getFullYear();
  }

  return (
    <footer>

      <p>&copy;    © {getYear()} Your Name
        My Shop. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
