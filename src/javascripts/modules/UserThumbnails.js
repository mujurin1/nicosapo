import moment from 'moment';
import Common from "../common/Common";

export default class UserThumbnails {
  /**
   * 
   * @param {import('../api/types/ProgramInfo').ProgramInfo[]} programs 
   * @returns 
   */
  static getParams(programs) {
    if (programs.length === 0) {
      const message = document.createElement("div");
      message.className = "message";
      message.textContent = "フォロー中の コミュニティ・チャンネル が放送している番組がありません．";
    }

    const thumbParams = [];
    let index = 0;

    programs.forEach(program => {
      const thumbParam = {};
      // const thumbnailUrl = program.querySelector("community thumbnail").textContent;
      const thumbnailUrl = program.programProvider?.iconSmall;
      thumbParam.background = `url('${thumbnailUrl}')`;
      // thumbParam.title = program.querySelector("video title").textContent;
      thumbParam.title = program.title;
      // thumbParam.id = program.querySelector("video id").textContent;
      thumbParam.id = program.id;
      thumbParam.url = `https://live.nicovideo.jp/watch/${thumbParam.id}`;
      thumbParam.text = thumbParam.title;

      // const unixTime = program.querySelector("video open_time_jpstr").textContent;
      // program.elapsed_time: 経過時間
      // unixTime 経過時間と現在時刻を元に放送開始時刻を計算する
      const unixTime = Math.floor(program.beginAt / 1000);

      moment.locale('jp');
      const start = moment.unix(unixTime);

      const date = new Date(start);

      thumbParam.openDate = date;

      // thumbParam.isReserved = UserThumbnails.isReserved(program);
      thumbParam.isReserved = false;
      thumbParam.isOfficial = false;
      thumbParam.openTime = thumbParam.isReserved ? moment.unix(unixTime).calendar() : undefined;

      const today = new Date();
      switch (date.getDate() - today.getDate()) {
        case 0:
          thumbParam.day = `今日`;
          break;
        case 1:
          thumbParam.day = `明日`;
          break;
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
          thumbParam.day = Common.jpDay(date.getDay());
          break;
        default:
          thumbParam.day = `${date.getDate()}日`;
          break;
      }

      thumbParam.index = index++;
      thumbParams.push(thumbParam);
    });

    return thumbParams;
  }

  static isReserved(program) {
    const is_reserved = program.querySelector("video is_reserved").textContent;
    return is_reserved == "true";
  }
}
