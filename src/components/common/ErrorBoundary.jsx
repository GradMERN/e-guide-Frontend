import React from "react";
import { HiOutlineShieldExclamation } from "react-icons/hi2";
import { FiRefreshCw, FiHome } from "react-icons/fi";
import { motion } from "framer-motion";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    if (import.meta.env.MODE === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  handleReload = () => window.location.reload();
  handleGoHome = () => (window.location.href = "/");

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full bg-surface rounded-[2.5rem] shadow-2xl p-8 md:p-14 text-center border border-border relative overflow-hidden">            
            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-red-500 via-primary to-red-500" />

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-red-500/10 flex items-center justify-center mb-8 ring-8 ring-red-500/5">
                <HiOutlineShieldExclamation className="text-4xl md:text-5xl text-red-500" />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-text mb-4 tracking-tight">
                Oops! Something went wrong
              </h1>

              <p className="text-text-secondary text-lg md:text-xl mb-12 leading-relaxed max-w-lg">
                We're sorry, but something unexpected happened. Please try refreshing the page or return to the homepage.
              </p>

              {import.meta.env.MODE === "development" && this.state.error && (
                <details className="mb-10 w-full text-left bg-background/50 rounded-2xl p-6 text-sm border border-border/50">
                  <summary className="cursor-pointer text-text font-semibold mb-3 opacity-70 hover:opacity-100 transition-opacity">
                    Technical Details (Development Only)
                  </summary>
                  <div className="max-h-60 overflow-auto font-mono text-red-400 text-xs leading-5">
                    <p className="font-bold mb-2">{this.state.error.toString()}</p>
                    <pre className="whitespace-pre-wrap">
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </div>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <motion.button  whileHover={{ scale: 1.02 }}  whileTap={{ scale: 0.98 }}  onClick={this.handleReload}  className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-primary text-black rounded-2xl font-bold shadow-lg shadow-primary/25 hover:bg-secondary transition-all">
                  <FiRefreshCw className="text-xl" />
                  Refresh Page
                </motion.button>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}  onClick={this.handleGoHome}  className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-surface border border-border text-text rounded-2xl font-bold hover:bg-border/30 transition-all">
                  <FiHome className="text-xl" />
                  Go Home
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;