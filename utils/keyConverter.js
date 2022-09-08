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

  dataCollectionTerm = (key) => {
    switch (key) {
      case 1:
        return "1차 - 2022년 9월 19일 ~ 2022년 9월 23일";
      case 2:
        return "2차 - 2022년 10월 3일 ~ 2022년 10월 7일";
      case 3:
        return "3차 - 2022년 10월 17일 ~ 2022년 10월 21일";
      default:
        return "";
    }
  };
}

export default new KeyConverter();
