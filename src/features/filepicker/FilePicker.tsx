import React, { createRef } from 'react';
import { createImageFromBase64, getFileAsBase64, setImageToCanvas } from '../canvas/Canvas';
import MenuButton from '../menu/MenuButton';

import './FilePicker.css';

const FilePicker = () => {

	const ref = createRef<HTMLInputElement>();

	const onClick = () => {
		ref.current?.click();
	};

	const onChange = async () => {
		const files = ref.current?.files;
		const file = files && files[0];
		if (!file) return;

		const base64 = await getFileAsBase64(file);
		if (!base64) return;

		const image = await createImageFromBase64(base64);
		setImageToCanvas(image);
	};

	return (
		<div id='feature-filepicker'>
			<input type='file' ref={ref} onChange={onChange} />
			<MenuButton code='filepicker' icon='file' label='Load Image' onClick={onClick} />
		</div>
	)
}

export default FilePicker;