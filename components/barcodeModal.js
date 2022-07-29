import Modal from 'react-modal';
import React from 'react';
import dynamic from 'next/dynamic';

const BarcodeScanner = dynamic(() => import('../components/barcodeScanner.js'), { ssr: false });

const customStyles = {
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '2px solid black',
        maxHeight: '60vh'
    }
};
const BarcodeModal = ({ isOpen, setIsOpen }) => {
    return (
        <Modal isOpen={isOpen} ariaHideApp={false} onRequestClose={() => setIsOpen(false)} style={customStyles}>
            <h2>Scan Item</h2>
            <BarcodeScanner setIsOpen={setIsOpen} />
            <button onClick={() => setIsOpen(false)}>Close</button>
        </Modal>
    );
};

export default BarcodeModal;
