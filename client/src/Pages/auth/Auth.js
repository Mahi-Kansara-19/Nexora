import React, { useState } from 'react';
import './Auth.css';
import { useDispatch, useSelector } from 'react-redux';
import { logIn, signUp } from '../../actions/AuthAction.js';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.authReducer);

  const [data, setData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmpass: ''
  });

  const [confirmPass, setConfirmPass] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    if (!confirmPass) setConfirmPass(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignUp) {
      if (data.password !== data.confirmpass) {
        setConfirmPass(false);
        return;
      }
      dispatch(signUp(data));
    } else {
      dispatch(logIn(data));
    }
  };

  const toggleMode = () => {
    setIsSignUp((prev) => !prev);
    setConfirmPass(true);
    setData({
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmpass: ''
    });
  };

  const isFormValid = isSignUp
    ? data.email && data.password && data.firstname && data.lastname && data.confirmpass
    : data.email && data.password;

  return (
    <div className="auth-page-container">
      <div className="auth-center-wrapper">
        {/* Left Side: Mockup Preview (Desktop) */}
        <div className="auth-preview-mockup">
          <div className="mockup-phone-frame">
            <div className="mockup-screen-inner">
              <div className="mockup-header-bar">
                <span className="mockup-logo">Nexora</span>
              </div>
              <div className="mockup-card">
                <div className="mockup-user-row">
                  <div className="mockup-avatar gradient-ring"></div>
                  <div>
                    <div className="mockup-bar short"></div>
                    <div className="mockup-bar tiny"></div>
                  </div>
                </div>
                <div className="mockup-photo"></div>
                <div className="mockup-actions">
                  <span className="mockup-icon red-heart">♥</span>
                  <span className="mockup-icon">💬</span>
                  <span className="mockup-icon">↗</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form Cards */}
        <div className="auth-forms-column">
          {/* Main Card */}
          <div className="auth-main-card">
            <h1 className="auth-logo">Nexora</h1>

            {isSignUp && (
              <p className="auth-subtitle">
                Sign up to see photos and moments from your friends.
              </p>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              {isSignUp && (
                <div className="auth-name-row">
                  <div className="auth-input-group">
                    <input
                      type="text"
                      name="firstname"
                      placeholder="First Name"
                      className="auth-input"
                      value={data.firstname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="auth-input-group">
                    <input
                      type="text"
                      name="lastname"
                      placeholder="Last Name"
                      className="auth-input"
                      value={data.lastname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="auth-input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="auth-input"
                  value={data.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-input-group password-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  className="auth-input"
                  value={data.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <VisibilityOffOutlinedIcon style={{ fontSize: 18 }} />
                  ) : (
                    <VisibilityOutlinedIcon style={{ fontSize: 18 }} />
                  )}
                </button>
              </div>

              {isSignUp && (
                <div className="auth-input-group">
                  <input
                    type="password"
                    name="confirmpass"
                    placeholder="Confirm Password"
                    className="auth-input"
                    value={data.confirmpass}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              {!confirmPass && (
                <p className="auth-error-msg">
                  * Passwords do not match. Please verify and try again.
                </p>
              )}

              {error && (
                <p className="auth-error-msg">
                  * Invalid credentials or account already exists. Please try again.
                </p>
              )}

              <button
                type="submit"
                className="ig-btn-primary auth-submit-btn"
                disabled={loading || !isFormValid}
              >
                {loading ? 'Please wait...' : isSignUp ? 'Sign up' : 'Log in'}
              </button>
            </form>

            <div className="auth-divider">
              <span className="divider-line"></span>
              <span className="divider-text">OR</span>
              <span className="divider-line"></span>
            </div>

            <div className="auth-demo-note">
              <span>Connect with friends and discover amazing moments.</span>
            </div>
          </div>

          {/* Switch Mode Card */}
          <div className="auth-switch-card">
            <p>
              {isSignUp ? 'Have an account?' : "Don't have an account?"}{' '}
              <button type="button" className="auth-switch-link" onClick={toggleMode}>
                {isSignUp ? 'Log in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="auth-page-footer">
        <div className="auth-footer-links">
          <span>About</span> •
          <span>Help</span> •
          <span>Press</span> •
          <span>API</span> •
          <span>Privacy</span> •
          <span>Terms</span> •
          <span>Locations</span>
        </div>
        <div className="auth-footer-copy">
          © 2026 NEXORA FROM MERN STACK
        </div>
      </footer>
    </div>
  );
};

export default Auth;
