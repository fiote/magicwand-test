import React from 'react';
import Menu from '../features/menu/Menu';
import MagicWand from '../features/magicwand/MagicWand';
import Pencil from '../features/pencil/Pencil';
import './App.css';
import Canvas from '../features/canvas/Canvas';
import FilePicker from '../features/filepicker/FilePicker';

import { Provider } from 'react-redux';
import store from './store';
import Stats from '../features/stats/Stats';

function App() {
  return (
    <div className="app">
		<Provider store={store}>
			<AppContent/>
		</Provider>
    </div>
  );
}

export const AppContent = () => {
	return (
		<div className="app-content">
			<Menu>
				<FilePicker />
				<MagicWand />
			</Menu>
			<Canvas />
			<Stats />
		</div>
	)

}

export default App;
