import $ from "jquery";
import FormatNicoPage from "./modules/FormatNicoPage";
import PageType from "./modules/PageType";
import CommunityPage from './page/CommunityPage';
import ModernCastPage from "./page/ModernCastPage";
import OfficialCastPage from "./page/OfficialCastPage";
import TimeShiftPage from "./page/TimeShiftPage";
import ModernTimeShiftPage from "./page/ModernTimeShiftPage";
import ChannelPage from "./page/ChannelPage";
import StandByPage from "./page/StandByPage";

const formatNicoPage = new FormatNicoPage();

$(() => {
  const pageType = PageType.get();
  formatNicoPage.exec(pageType);
  const pages = {
    COMMUNITY_PAGE: CommunityPage,
    MODERN_CAST_PAGE: ModernCastPage,
    OFFICIAL_CAST_PAGE: OfficialCastPage,
    TIME_SHIFT_PAGE: TimeShiftPage,
    MODERN_TIME_SHIFT_PAGE: ModernTimeShiftPage,
    CHANNEL_PAGE: ChannelPage,
    STANDBY_PAGE: StandByPage
  };
  const page = new pages[pageType]();
  page.putWidgets();
});