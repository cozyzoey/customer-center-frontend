class KeyConverter {
  gender = (key) => {
    switch (key) {
      case "male":
        return "남자";
      case "female":
        return "여자";
      default:
        return "";
    }
  };

  level = (key) => {
    switch (key) {
      case "high":
        return "상";
      case "medium":
        return "중";
      case "low":
        return "하";
      default:
        return "";
    }
  };
}

export default new KeyConverter();
