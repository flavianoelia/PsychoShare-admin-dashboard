import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorCount: 0 };
  }

  static getDerivedStateFromError(error) {
    // Actualizar el estado para que el siguiente renderizado muestre la interfaz de respaldo
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Registrar el error en la consola
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    
    // Recuperarse automáticamente después de un breve momento
    setTimeout(() => {
      this.setState({ hasError: false, errorCount: this.state.errorCount + 1 });
    }, 100);
  }

  render() {
    if (this.state.hasError) {
      // Mostrar brevemente un componente vacío mientras se recupera
      return <div style={{ display: 'none' }}></div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
