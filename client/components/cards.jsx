import React from 'react';
import AppContext from '../lib/app-context';

const buttons = [
  { name: 'Select Card', action: 'select-card' },
  { name: 'Ready', action: 'ready' }
];

const styles = {
  button: {
    width: '130px',
    height: '40px',
    borderRadius: '7px',
    backgroundColor: '#dbdbdb',
    border: 'none',
    margin: '1%'
  }
};

export default class Cards extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      cards: null,
      images: null,
      cardShown: 0,
      isReadyDisabled: false,
      message: '',
      messageClass: ''
    };

    this.handleDotClick = this.handleDotClick.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
  }

  componentDidMount() {
    this.getCards();
    this.getImages();
  }

  updateCards(cards) {
    this.setState({ cards: cards });
  }

  updateImages(images) {
    this.setState({ images: images });
  }

  getImages() {
    fetch('/api/images')
      .then(res => res.json())
      .then(images => {
        this.updateImages(images);
      });
  }

  getCards() {
    fetch('/api/cards')
      .then(res => res.json())
      .then(cards => {
        this.updateCards(cards);
      });
  }

  handleNext() {

    if (this.state.cards.length === this.state.cardShown + 1) {
      this.setState({ cardShown: 0 });
    } else {
      this.setState({ cardShown: this.state.cardShown + 1 });
    }

    this.setState({
      message: '',
      messageClass: ''
    });

  }

  handlePrevious() {

    if (this.state.cardShown === 0) {
      this.setState({ cardShown: this.state.cards.length - 1 });
    } else {
      this.setState({ cardShown: this.state.cardShown - 1 });
    }

    this.setState({
      message: '',
      messageClass: ''
    });

  }

  handleDotClick(index) {
    this.setState({
      cardShown: index,
      message: '',
      messageClass: ''
    });
  }

  handleClick(action) {

    const { user } = this.context;
    const { game } = this.context;
    const data = {
      userId: user.userId,
      cardId: this.state.cards[this.state.cardShown].cardId,
      gameId: game.gameId
    };

    if ((action === 'select-card') && (this.state.isReadyDisabled === false)) {

      const req = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };
      fetch('/api/cards', req)
        .then(res => res.json())
        .then(result => {
          if (!result.error) {
            this.setState({ message: 'card  was seleted', messageClass: 'cards-message', isReadyDisabled: true });
          } else {
            this.setState({ message: 'an error has occurred', messageClass: 'cards-error-message' });
          }
        });
    }

  }

  getButtons() {
    const listButtons = buttons.map(button => {

      let buttonClass = '';

      if ((button.name === 'Select Card') && (this.state.isReadyDisabled)) {
        buttonClass = 'cards-button';
      }

      return (
        <button key={button.name} style={styles.button} onClick={() => this.handleClick(button.action)} className={buttonClass} >{button.name}</button>
      );
    });
    return listButtons;

  }

  gettingDots() {

    const cards = this.state.cards;
    let dotClassName;
    const dots = cards.map((card, index) => {

      if (index === this.state.cardShown) {
        dotClassName = 'fa-circle';
      } else {
        dotClassName = 'fa-circle-notch';
      }

      return (
        <div className="dots" key={index}><i className={`fas fa-regular ${dotClassName}`} onClick={() => this.handleDotClick(index)}></i></div>
      );
    });

    return dots;

  }

  gettingImages(cardName) {

    if (this.state.images !== null) {
      const images = this.state.images;
      const listImages = images.map((image, index) => {
        const identifier = `${index} ${cardName} ${image.imageName} ${image.imageId}`;
        if (image.cardName === cardName) {
          return (
            <div key={identifier} className="column-forth">
              <img className="image-card" src={image.imageUrl} />
            </div>
          );
        }
        return null;
      });
      return listImages;
    }

  }

  buildingCard() {

    const cards = this.state.cards;
    const cardName = cards[this.state.cardShown].cardName;
    const { game } = this.context;
    const cardImages = this.gettingImages(cardName);

    return (
      <div className="card-images" >
        <div className="game-name">
          <h6>{game.gameName}</h6>
        </div>
        <div className="card-container">
          <div className="row card-row">
            {cardImages}
          </div>
        </div>
      </div>
    );

  }

  renderPage() {
    let cards;
    let dots;
    const buttons = this.getButtons();

    if (this.state.cards != null) {
      cards = this.buildingCard();
      dots = this.gettingDots();
    }

    return (
      <>
        <div className="row">
          <div className="column-arrow">
            <div className="direction-icon left"><i className="fas fa-solid fa-angle-left" onClick={this.handlePrevious}></i></div>
          </div>
          <div className="column-card">
            {cards}
          </div>
          <div className="column-arrow">
            <div className="direction-icon right"><i className="fas fa-solid fa-angle-right" onClick={this.handleNext}></i></div>
          </div>
        </div>
        <div className="dots-row">
          {dots}
        </div>
        <div className="row">
          {buttons}
        </div>
        <div className={this.state.messageClass}>{this.state.message}</div>
      </>
    );

  }

  render() {

    return (
      <>
       {this.renderPage()}
      </>
    );

  }

}

Cards.contextType = AppContext;
