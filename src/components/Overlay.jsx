export function Overlay() {
  
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%', fontFamily: 'Bebas Neue', fontSize: '1em', fontWeight: '24', opacity: '100%', letterSpacing: '0.04em' }}>
        <div className="Controls">Controls: W A S D<br />Reset: R</div>
        <a className="MadeBy" href="https://github.com/Xahri" target="_blank" rel="noopener noreferrer" style={{ position: 'absolute', bottom: 40, left: 90, fontSize: '13px' }}>
            Bassem Youssef —
        </a>
        <div style={{ position: 'absolute', bottom: 40, right: 90, fontSize: '13px' }}>
            18/01/2023
        </div>
      </div>
    )
}