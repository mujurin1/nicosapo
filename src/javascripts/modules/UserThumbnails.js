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
      // old: const thumbnailUrl = program.querySelector("community thumbnail").textContent;
      const thumbnailUrl = program.programProvider?.iconSmall;
      thumbParam.background = `url('${thumbnailUrl}')`;
      // old: thumbParam.title = program.querySelector("video title").textContent;
      thumbParam.title = program.title;
      // old: thumbParam.id = program.querySelector("video id").textContent;
      thumbParam.id = program.id;
      thumbParam.url = `https://live.nicovideo.jp/watch/${thumbParam.id}`;
      thumbParam.text = thumbParam.title;

      // old: const unixTime = program.querySelector("video open_time_jpstr").textContent;
      const unixTime = Math.floor(program.beginAt / 1000);

      moment.locale('jp');
      const start = moment.unix(unixTime);

      const date = new Date(start);

      thumbParam.openDate = date;

      // old: thumbParam.isReserved = UserThumbnails.isReserved(program);
      thumbParam.isReserved = program.liveCycle === "RELEASED";
      thumbParam.isOfficial = false;
      thumbParam.openTime = thumbParam.isReserved ? moment.unix(unixTime).calendar() : undefined;

      const today = new Date();
      console.log(`>>> title: ${thumbParam.title}, ${date.getDate() - today.getDate()}`);
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
