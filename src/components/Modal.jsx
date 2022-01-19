export function Modal({message, deactivate}) {
    return (
        <div className="modal-wrapper">
            <div className="modal-backdrop" onClick={deactivate}></div>
            <div className="modal-content">
                <p>{message}</p>
                <button className="button block" onClick={deactivate}>Okay</button>
            </div>
        </div>
    )
}