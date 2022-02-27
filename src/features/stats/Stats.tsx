import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { getRGBfromInt, getHexFromRGB } from '../canvas/Canvas';
import { ControlsSliceState } from '../canvas/controlsSlice';

import './Stats.css';

const CanvasStats = () => {
	const controls = useSelector<RootState>((state) => state.controls) as ControlsSliceState;


	const blockDivs = Object.keys(controls).map(block => {
		const { top50, total } = controls[block];

		const colorDivs = top50.map(entry => {
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

		const classes = ['stat-block', block.toLowerCase()].join(' ');

		return (
			<div key={block} className={classes}>
				<h4>{block} (<span className='block-count'>{total}</span>)</h4>
				{colorDivs}
			</div>
		)
	});

	return (
		<div id="feature-stats">
			{blockDivs}
		</div>
	)
}

export default CanvasStats;