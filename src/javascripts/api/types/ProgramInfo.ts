import { NicoMeta } from "./Meta";

export interface ProgramInfoResponse extends NicoMeta {
  data: {
    programs: ProgramInfo[];
    total: number;
  };
}

/**
 * URL: https://live.nicovideo.jp/front/api/pages/follow/v1/programs?status=onair&offset=0
 */
export interface ProgramInfo {
  /**
   * 放送ID (lv--)
   */
  id: string;
  /**
   * 放送タイトル
   */
  title: string;
  /**
   * サムネイル画像URL\
   * ※ `flippedListingThumbnail` がある場合、こちらはホバー前の画像になる
   */
  listingThumbnail: string;

  /**
   * サムネイル画像URL (ホバー時用)\
   * ※ 放送者がサムネイルを設定している場合、こちらが放送内容を反映したサムネイルになる
   */
  flippedListingThumbnail?: string;

  /**
   * 放送ページURL (クエリ付き)
   */
  watchPageUrl: string;

  /**
   * 放送提供者の種類 (community 以外は推測値)
   */
  providerType: "community" | "channel" | "user";
  /**
   * - `ON_AIR`: 放送中
   * - `RELEASED`: 放送予定
   * - `ENDED`: 放送終了
   */
  liveCycle: "ON_AIR" | "RELEASED" | "ENDED",

  /**
   * 放送開始時刻 (ミリ秒)\
   * 枠を開いた時の時刻 (おそらく)
   */
  beginAt: number;
  /**
   * 放送終了時刻 (ミリ秒)\
   * 延長等で変動する可能性あり
   */
  endAt: number;

  isFollowerOnly: boolean;
  isPayProgram: boolean;

  /**
   * 放送者の情報
   */
  programProvider: {
    /** 放送者ID */
    id: number;
    /** 放送者名 */
    name: string;
    /** 放送者アイコンURL */
    icon: string;
    /** 放送者アイコンURL (小) */
    iconSmall: string;
  };

  /** 放送の統計情報 */
  statistics: {
    /** 視聴者数 */
    watchCount: number;
    /** コメント数 */
    commentCount: number;
    /**
     * タイムシフト予約数\
     * ※ 0件の場合は存在しない?
     */
    reservationCount?: number;
  };

  timeshift: {
    /** タイムシフト視聴可能か */
    isPlayable: boolean;
    /** タイムシフト予約可能か */
    isReservable: boolean;
  };
}


