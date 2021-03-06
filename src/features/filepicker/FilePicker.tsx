import React, { createRef } from 'react';
import { useDispatch } from 'react-redux';
import { setImageToCanvas } from '../canvas/Canvas';
import { setColors } from '../canvas/controlsSlice';
import MenuButton from '../menu/MenuButton';
import { setMenuActive } from '../menu/menuSlice';

import './FilePicker.css';

const FilePicker = () => {
	const dispatch = useDispatch();
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
		const { colors } = await setImageToCanvas(image);
		dispatch(setColors({key: 'Pixels', list: colors}));

		ref.current.value = '';
		dispatch(setMenuActive('magicwand'));
	};

	return (
		<div id='feature-filepicker'>
			<input data-testid='filepicker-file' type='file' ref={ref} onChange={onChange} />
			<MenuButton code='filepicker' icon='file' label='Load Image' onClick={onClick} />
		</div>
	)
}


const getFileAsBase64 = (file: File): Promise<string | undefined> => {
	return new Promise(resolve => {
		var fr = new FileReader();
		fr.onload = () => resolve(fr.result?.toString());
		fr.readAsDataURL(file);
	});
};

const createImageFromBase64 = (base64: string): Promise<HTMLImageElement> => {
	return new Promise(resolve => {
		const img = new Image();
		img.onload = (e) => resolve(img);
		img.src = base64;
	});
};


export default FilePicker;