import React from 'react';
import Logo from '../components/logo';
import AppContext from '../lib/app-context';

const buttons = [
  { name: 'Enter', action: 'enter' },
  { name: 'Cancel', action: 'cancel' }
];

const styles = {
  game: {
    width: '148px',
    margin: '0.31rem',
    border: 'none',
    backgroundColor: '#e5e3e3'
  },
  button: {
    width: '95px',
    height: '35px',
    borderRadius: '7px',
    backgroundColor: '#dbdbdb',
    border: 'none',
    marginRight: '3%',
    marginTop: '3%'
  }
};

export default class AccessGame extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      game: '',
      errorMessage: '',
      hidden: 'hidden',
      buttonAction: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);

  }

  componentDidMount() {

    const { user } = this.context;

    if (user === null) {
      window.location.hash = 'no-found';
    }

  }

  handleClick() {
    this.setState({ errorMessage: '', hidden: 'hidden' });
  }

  handleErrorMessage(message) {
    this.setState({ errorMessage: message, hidden: '' });
  }

  handleChange(event) {

    const { name, value } = event.target;
    this.setState({ [name]: value });

  }

  handleSubmit(action) {
    event.preventDefault();

    const { handleGame } = this.context;

    if (this.state.buttonAction === 'cancel') {
      window.location.hash = 'main-menu';
    }

    if (this.state.buttonAction === 'enter') {
      if (this.state.game === '') {
        this.handleErrorMessage('game field is empty');
      } else {
        const { game } = this.state;

        fetch(`/api/game/${game}`)
          .then(res => res.json())
          .then(game => {
            if (!game.error) {
              window.location.hash = 'game-menu';
              handleGame(game);
            } else {
              this.handleErrorMessage(game.error);
            }
          })
          .catch(error => {
            // eslint-disable-next-line no-console
            console.log(`Error: ${error}`);
            window.location.hash = 'error-connection';
          });
      }
    }

  }

  getButtons() {

    const listButtons = buttons.map((button, index) => {

      return (
        <button key={index} type={button.type} style={styles.button} onClick={() => (this.setState({ buttonAction: button.action })) }>{button.name}</button>
      );
    });

    return listButtons;

  }

  render() {

    const buttons = this.getButtons();

    return (
      <>
        <div className="row">
          <div className="column-half">
            <div className="acces-game-logo">
              <Logo className="new-account-img-logo" />
            </div>
          </div>

          <div className="column-half access-game-column-half">
            <div className="access-game-form-container">
              <form className="form-access-game" onSubmit={this.handleSubmit}>
                <div className="access-game-title">
                  <h5>Access Game</h5>
                </div>
                <div className="access-game-input">
                  <label>Game:   </label>
                  <input type="text" name="game" style={styles.game} onChange={this.handleChange} onClick={this.handleClick} />
                </div>
                <div className="access-game-button">
                  {buttons}
                </div>
              </form>
              <div className={`access-game-error-message ${this.state.hidden}`}>
                <span>&#9888;{this.state.errorMessage}</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );

  }

}

AccessGame.contextType = AppContext;
