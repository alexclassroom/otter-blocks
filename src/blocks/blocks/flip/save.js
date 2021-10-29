/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies.
 */
import { InnerBlocks, RichText } from '@wordpress/block-editor';

const Save = ({
	attributes,
	className
}) => {
	return (
		<div
			id={ attributes.id }
			className={
				classnames(
					className,
					{'flipX': 'flipX' === attributes.animType},
					{'flipY': 'flipY' === attributes.animType},
					'anim'
				)
			}
		>
			<div
				className={
					classnames(
						'o-inner',
						{ invert: attributes.isInverted }
					)
				}
			>
				<div className="o-front">
					<div
						className="o-content"
					>
						{
							attributes.frontMedia?.url && (
								<img
									className="o-ing"
									srcSet={ attributes.frontMedia?.url }
								/>
							)
						}

						<RichText.Content
							tagName="h1"
							value={ attributes.title }
						/>

						<RichText.Content
							tagName="p"
							value={ attributes.description }
						/>
					</div>
				</div>
				<div className="o-back">
					<InnerBlocks.Content />
				</div>
			</div>
		</div>
	);
};

export default Save;