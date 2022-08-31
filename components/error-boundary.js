import React from "react";
import Button from "@/components/button";
import styles from "@/styles/shared/error-page.module.scss";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.log({ error, errorInfo });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <h2>에러가 생겼어요</h2>
          <Button
            type="button"
            onClick={() => this.setState({ hasError: false })}
          >
            재시도하기
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
