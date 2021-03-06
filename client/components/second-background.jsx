
import React from 'react';
import NewAccountForm from '../pages/new-account-form';
import Title from './title';
import ProfileForm from '../pages/profile-form';
import AppContext from '../lib/app-context';
import Instructions from '../pages/instructions';
import AccessGame from '../pages/access-game';
import GameMenu from '../pages/game-menu';
import Cards from './cards';

export default class SecondBackground extends React.Component {

  renderPage() {

    const { route, firstName, lastName, email, username } = this.context;
    const value = { firstName, lastName, email, username };

    if (route.path === 'sign-up') {
      return <NewAccountForm />;
    }
    if (route.path === 'profile-form') {
      if (value.username !== '') {
        return <ProfileForm value={value} />;
      } else {
        window.location.hash = 'no-found';
      }
    }
    if (route.path === 'instructions') {
      return <Instructions />;
    }
    if (route.path === 'access-game') {
      return <AccessGame />;
    }
    if (route.path === 'game-menu') {
      return <GameMenu />;
    }
    if (route.path === 'cards') {
      return <Cards />;
    }

  }

  render() {

    return (
      <>
        <div className="container">
          <div className="new-account-column-title">
            <Title />
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="blue-background">
              <div className="gray-background">
                <>
                  {this.renderPage()}
                </>
              </div>
            </div>
          </div>
        </div>

      </>

    );
  }
}

SecondBackground.contextType = AppContext;
