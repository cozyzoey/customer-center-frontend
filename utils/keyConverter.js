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
}

export default new KeyConverter();
