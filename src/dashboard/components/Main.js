/**
 * WordPress dependencies.
 */
import {
	__,
	sprintf
} from '@wordpress/i18n';

import {
	Placeholder,
	Spinner
} from '@wordpress/components';

import { Fragment  } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import useSettings from '../../blocks/helpers/use-settings.js';
import Sidebar from './Sidebar.js';
import Dashboard from './pages/Dashboard.js';
import Upsell from './pages/Upsell.js';
import Integrations from './pages/Integrations.js';
import Feedback from './pages/Feedback.js';
import NoticeCard from './NoticeCard';
import { applyFilters } from '@wordpress/hooks';
import Blocks from './pages/Blocks';
import Deal from './Deal';

let daysLeft = sprintf( 
	// Translators: %s is the number of days left.
	__( '%s Days', 'otter-blocks' ), 
	Number( window.otterObj.daysLeft ) 
);

if ( 1 === Number( window.otterObj.daysLeft ) ) {
	daysLeft = __( 'Less than 24 hours', 'otter-blocks' );
}

const Main = ({
	currentTab,
	setTab
}) => {
	const [ getOption, updateOption, status ] = useSettings();
	const feedbackBtn = applyFilters( 'otter.feedback', '', 'dashboard', __( 'Share your Feedback', 'otter-blocks' ), 'secondary' );

	if ( 'loading' === status ) {
		return (
			<Placeholder>
				<Spinner />
			</Placeholder>
		);
	}

	const Content = () => {
		switch ( currentTab ) {
		case 'integrations':
			return (
				<div className="otter-left">
					<Integrations/>
				</div>
			);
		case 'upsell':
			return (
				<Upsell />
			);
		case 'feedback':
			return (
				<Feedback />
			);
		case 'blocks':
			return (
				<Blocks />
			);
		default:
			return (
				<div className="otter-left">
					<Dashboard
						status={ status }
						getOption={ getOption }
						updateOption={ updateOption }
					/>
				</div>
			);
		}
	};

	return (
		<Fragment>
			{
				( window.otterObj?.deal?.active && window.otterObj.deal?.bannerStoreUrl ) && (
					<Deal
						link={window.otterObj.deal.bannerStoreUrl}
						image={window.otterObj.deal.bannerUrl}
						alt={window.otterObj.deal.bannerAlt}
						urgencyText={window.otterObj.deal.urgencyText}
					/>
				)
			}
			<div id="tsdk_banner" className="otter-banner"></div>
			<div className={ `otter-main is-${ currentTab }`}>

				{ 'dashboard' === currentTab && window.otterObj.showFeedbackNotice && (
					<NoticeCard
						slug="feedback"
					>
						{/* eslint-disable-next-line jsx-a11y/alt-text */}
						<img src={ window.otterObj.assetsPath + 'images/dashboard-feedback.png' } style={ { maxWidth: '100%', objectFit: 'cover' } } />
						<div className="notice-text">
							<h3>{ __( 'What\'s the one thing you need in Otter Blocks?', 'otter-blocks' ) }</h3>
							<span>{ __( 'We\'re always looking for suggestions to further improve Otter Blocks and your feedback can help us do that.', 'otter-blocks' ) }</span>
						</div>
						<span>
							{ feedbackBtn }
						</span>
					</NoticeCard>
				) }

				<Content />

				{ ( 'upsell' !== currentTab && 'blocks' !== currentTab ) && (
					<div className="otter-right">
						<Sidebar setTab={ setTab }/>
					</div>
				) }
			</div>
		</Fragment>
	);
};

export default Main;
