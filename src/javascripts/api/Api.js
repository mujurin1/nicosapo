import { parseString } from "xml2js";
import FollowApiResponseParser from "../modules/FollowApiResponseParser";

export default class Api {
  static isLogined() {
    return new Promise((resolve, reject) => {
      Api.loadCasts("user")
        .then(programs => {
          resolve(true);
        })
        .catch(() => {
          reject(false);
        });
    });
  }

  static loadCasts(liveType) {
    return new Promise((resolve, reject) => {
      switch (liveType) {
        case "user":
          Api.getUserOnair()
            .then($videoInfos => {
              resolve($videoInfos);
            })
            .catch(reject);
          break;
        case "reserve":
          Api.getUserFuture()
            .then($videoInfos => {
              resolve($videoInfos);
            })
            .catch(reject);
          break;
        case "official":
          Api.getOfficialOnair().then(official_lives => {
            resolve(official_lives);
          });
          break;
        case "future":
          Api.getFutureOnair().then(future_lives => {
            resolve(future_lives);
          });
          break;
      }
    });
  }

  // jQuery オブジェクトでなく JSON を返したい
  static getUserOnair() {
    return new Promise((resolve, reject) => {
      const url = "https://live.nicovideo.jp/front/api/pages/follow/v1/programs?status=onair&offset=0";

      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          resolve(data.data.programs.map(FollowApiResponseParser.parse));
        })
        .catch(error => {
          reject(error);
        });
    });
  }


  // jQuery オブジェクトでなく JSON を返したい
  static getUserFuture() {
    return new Promise((resolve, reject) => {
      const url = "https://live.nicovideo.jp/front/api/pages/follow/v1/programs?status=comingsoon&offset=0";

      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          resolve(data.data.programs.map(FollowApiResponseParser.parse));
        })
        .catch(error => {
          reject(error);
        });
    });
  }


  static getFutureOnair() {
    return new Promise(resolve => {
      const url = "https://live.nicovideo.jp/ranking?type=comingsoon";
      fetch(url).then(response => response.text()).then(data => {
        const parser = new DOMParser();
        const html = parser.parseFromString(data, "text/html");
        const futureStreams = html.querySelectorAll('[class^="___rk-ranking-area-ranking___"]:nth-child(1) [class^="___rk-program-card___"]');
        if (futureStreams) {
          resolve(futureStreams);
        }
      });
    });
  }

  static getOfficialOnair() {
    return new Promise(resolve => {
      const url = "https://live.nicovideo.jp/ranking?type=onair";
      fetch(url).then(response => response.text()).then(data => {
        const parser = new DOMParser();
        const html = parser.parseFromString(data, "text/html");
        const officialStreams = html.querySelectorAll('[class^="___rk-ranking-area-ranking___"]:nth-child(1) [class^="___rk-program-card___"]');
        resolve(officialStreams);
      });
    });
  }

  static getProgramStatus(programId) {
    return new Promise(resolve => {
      fetch(`https://live2.nicovideo.jp/unama/watch/${programId}/programinfo`)
        .then(response => response.json())
        .then(data => {
          if (data.meta.status === 200) {
            resolve({
              programId: programId,
              title: data.data.title,
              status: data.data.status,
              beginAt: data.data.beginAt,
              endAt: data.data.endAt
            });
          }
          resolve({
            programId: programId,
            title: null,
            status: "error",
            beginAt: -1,
            endAt: -1
          });
        })
        .catch(() => {
          resolve({
            programId: programId,
            title: null,
            status: "error",
            beginAt: -1,
            endAt: -1
          });
        });
    });
  }

  static getLatestProgram(communityId) {
    return new Promise(resolve => {
      fetch(`https://live2.nicovideo.jp/unama/tool/v1/broadcasters/social_group/${communityId}/program`)
        .then(response => response.json())
        .then(data => {
          if (data.meta.status === 200) {
            resolve({ programId: data.data.nicoliveProgramId });
          }
          resolve({ programId: null });
        })
        .catch(() => {
          resolve({ programId: null });
        });
    });
  }

  static search(query, sortMode) {
    return new Promise(resolve => {
      const sortModes = {
        "startTime-dsc": "recentDesc",
        "startTime-asc": "recentAsc",
        "viewCounter-dsc": "viewCountDesc",
        "viewCounter-asc": "viewCountAsc",
        "commentCounter-dsc": "commentCountDesc",
        "commentCounter-asc": "commentCountAsc"
      };
      const q = `https://sp.live.nicovideo.jp/api/search?q=${query}&sortOrder=${sortModes[sortMode]}&isTagSearch=false&disableGrouping=false&hideMemberOnly=false&timeshiftIsAvailable=false&status=onair&offset=0&limit=100`;
      fetch(q).then(response => response.json()).then(data => {
        resolve(data);
      });
    });
  }

  static getFollowingCommunities(cursor) {
    if (cursor === `cursorEnd`) {
      return Promise.resolve({
        cursor: cursor,
        items: []
      });
    }

    const parser = httpResponse => {
      const cursor = httpResponse.data.summary.cursor;
      const items = httpResponse.data.items.map(item => ({
        title: item.nickname,
        thumbnail: item.icons.large,
        id: item.id,
        url: `https://nicovideo.jp/user/${item.id}`
      }));
      return {
        cursor: cursor,
        items: items
      };
    };
    return new Promise(resolve => {
      const endpoint = `https://nvapi.nicovideo.jp/v1/users/me/following/users?pageSize=100`;
      let query = ``;
      if (cursor != null) {
        query = `&cursor=${cursor}`;
      }
      fetch(endpoint + query, { headers: { "x-frontend-id": "3" } }).then(response => response.json()).then(data => {
        const parsedResponse = parser(data);
        resolve(parsedResponse);
      });
    });
  }

  static fetchVideoStatistics(id, source = "statistics", title = "") {
    let url = '';

    if (source === "statistics")
      url = `https://live2.nicovideo.jp/watch/${id}/statistics`;
    else if (source === "apiv2")
      url = `https://api.search.nicovideo.jp/api/v2/live/contents/search?q=${title}&targets=title&fields=contentId,title,viewCounter,commentCounter&filters[liveStatus][0]=onair&_sort=-viewCounter`;

    return fetch(url)
      .then(response => {
        if (!response.ok)
          throw new Error("failed.");
        else
          return response;
      })
      .catch(error => {
        throw error;
      });
  }

  static fetchCommunityStatistics(distributorIdList) {
    const separator = ",";
    const joinedWith = distributorIdList.join(separator);
    const url = `https://api.ce.nicovideo.jp/api/v1/community.array?id=${joinedWith}`;
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error("request failed.");
        }
        return response.text();
      })
      .then(data => {
        let ret;
        parseString(data, (err, result) => {
          if (result.nicovideo_community_response.error != null) {
            ret = [];
          } else {
            ret = result.nicovideo_community_response.community;
          }
        });
        return ret;
      })
      .catch(error => {
        throw error;
      });
  }
}
