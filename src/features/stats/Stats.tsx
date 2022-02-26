import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { getRGBfromInt, getHexFromRGB } from '../canvas/Canvas';
import { ControlsSliceState } from '../canvas/controlsSlice';

import './Stats.css';

const CanvasStats = () => {
	const controls = useSelector<RootState>((state) => state.controls) as ControlsSliceState;

	const colors = Object.keys(controls.colors || {}).map(key => parseInt(key)).filter(key => key).map(key => ({color: key, count: controls.colors[key]}));
	colors.sort((a,b) => b.count - a.count);

	const colorDivs = colors.map(entry => {
		const rgb = getRGBfromInt(entry.color);
		const hex = getHexFromRGB(rgb);
		return (
			<div key={entry.color} className='color-row'>
				<div className='color-square' style={{backgroundColor: hex}}></div>
				<div className='color-label'>{hex}</div>
				<div className='color-count'>{entry.count}</div>
			</div>
		)
	});

	return (
		<div id="feature-stats">
			{colorDivs}
		</div>
	)
}

export default CanvasStats;