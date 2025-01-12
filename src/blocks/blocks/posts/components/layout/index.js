/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	__,
	sprintf
} from '@wordpress/i18n';

import { Placeholder } from '@wordpress/components';

import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import {
	Thumbnail,
	useThumbnail
} from './thumbnail.js';

import {
	getActiveStyle,
	unescapeHTML,
	formatDate
} from '../../../../helpers/helper-functions.js';

import { styles } from '../../constants.js';

const Layout = ({
	attributes,
	posts,
	categoriesList,
	authors
}) => {
	const activeStyle = getActiveStyle( styles, attributes?.className );
	const isTiled = 'tiled' === activeStyle;

	const postsToDisplay = posts
		.filter( post => post );

	return (
		<div
			className={
				'grid' === attributes.style ?
					classnames(
						'is-grid',
						`o-posts-grid-columns-${ attributes.columns }`
					) :
					'is-list'
			}
		>
			{ postsToDisplay
				.slice( attributes.enableFeaturedPost ? 1 : 0 )
				.map( post => {
					return (
						<PostBody
							key={ post.id }
							post={ post }
							attributes={ attributes }
							categoriesList={ categoriesList }
							authors={ authors }
							isTiled={ isTiled }
						/>
					);
				}) }
		</div>
	);
};

const PostBody = ({ post, attributes, categoriesList, authors, isTiled }) => {
	const { featuredImage } = useThumbnail( post?.featured_media, post.title?.rendered, attributes?.imageSize );
	const category = categoriesList && 0 < post?.categories?.length ? categoriesList.find( item => item.id === post.categories[0]) : undefined;
	const categories = categoriesList && 0 < post?.categories?.length ? categoriesList.filter( item => post.categories.includes( item.id ) ) : [];
	const author = authors && post.author ? authors.find( item => item.id === post.author ) : undefined;
	const hasFeaturedImage = 0 !== post.featured_media && attributes.displayFeaturedImage;
	const css = {
		backgroundPosition: 'center center',
		backgroundSize: 'cover'
	};

	if ( hasFeaturedImage && isTiled ) {
		css.backgroundImage = `url(${ featuredImage })`;
	}

	return (
		<div
			key={ post.link }
			className="o-posts-grid-post-blog o-posts-grid-post-plain"
			style={ css }
		>
			<div className={ classnames( 'o-posts-grid-post' ) }>
				{ ( hasFeaturedImage && ! isTiled ) && (
					<Thumbnail
						id={ post.featured_media }
						link={ post.link }
						alt={ post.title?.rendered }
						size={ attributes.imageSize }
						imgStyle={{
							borderRadius: attributes.borderRadius !== undefined ? attributes.borderRadius + 'px' : undefined
						}}
					/>
				) }

				<div
					className={ classnames(
						'o-posts-grid-post-body',
						{ 'is-full': ! attributes.displayFeaturedImage }
					) }
				>
					{ attributes.template.map( element => {
						switch ( element ) {
						case 'category':
							return <PostsCategory key={ element } attributes={ attributes } element={ element } category={ category } categoriesList={ categoriesList }/>;
						case 'title':
							return <PostsTitle key={ element } attributes={ attributes } element={ element } post={ post } />;
						case 'meta':
							return <PostsMeta key={ element } attributes={ attributes } element={ element } post={ post } author={ author } categories={ categories } />;
						case 'description':
							return <PostsDescription key={ element } attributes={ attributes } element={ element } post={ post } />;
						default:
							return applyFilters( 'otter.postsBlock.templateLoop', '', element, attributes );
						}
					}) }
				</div>
			</div>
		</div>
	);
};

export const PostsCategory = ({ attributes, element, category, categoriesList }) => {
	if ( undefined !== category && ( attributes.displayCategory && categoriesList ) ) {
		return <span key={ element } className="o-posts-grid-post-category">{ unescapeHTML( category.name ) }</span>;
	}
	return '';
};

export const PostsTitle = ({ attributes, element, post }) => {

	if ( ! attributes.displayTitle ) {
		return '';
	}

	const Tag = ! [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ].includes( attributes.titleTag ) ? 'h4' : attributes.titleTag;

	return (
		<Tag key={ element } className="o-posts-grid-post-title">
			<a href={ post.link }>
				{ unescapeHTML( post.title?.rendered ) }
			</a>
		</Tag>
	);
};

export const PostsMeta = ({ attributes, element, post, author, categories }) => {
	if ( attributes.displayMeta && ( attributes.displayDate || attributes.displayAuthor || attributes.displayComments || attributes.displayPostCategory ) ) {
		const meta = [];
		let postedOn = '';

		if ( attributes.displayDate ) {
			if ( attributes.displayUpdatedDate ) {

				/* translators: %s Date updated */
				postedOn += sprintf( __( 'Updated on %s', 'otter-blocks' ), formatDate( post.modified ) );
			} else {

				/* translators: %s Date posted */
				postedOn += sprintf( __( 'Posted on %s', 'otter-blocks' ), formatDate( post.date ) );
			}
		}

		if ( attributes.displayAuthor && undefined !== author ) {

			/* translators: %1$s is the date, %2$s is the author of the post */
			postedOn = sprintf( __( '%1$s by %2$s', 'otter-blocks' ), postedOn, author.name ).trim();
		}

		meta.push( postedOn );

		if ( ( attributes.displayComments ) ) {

			meta.push( sprintf(
				'%1$s %2$s',
				'0',
				'1' === '0' ? __( 'comment', 'otter-blocks' ) : __( 'comments', 'otter-blocks' )
			) );
		}

		if ( ( attributes.displayPostCategory && Boolean( categories.length ) ) ) {
			meta.push( categories.map( ({ name }) => name ).join( ', ' ) );
		}


		return (
			<p key={ element } className="o-posts-grid-post-meta">{ meta.join( ' /\ ' ) }</p>
		);
	}
	return '';
};

export const PostsDescription = ({ attributes,  element, post }) => {
	if ( 0 < attributes.excerptLength && attributes.displayDescription ) {
		return (
			<div key={ element } className="o-posts-grid-post-description">
				<p>
					{ post.excerpt?.rendered && unescapeHTML( post.excerpt.rendered ).substring( 0, attributes.excerptLength ) + '…' }
				</p>
				{ attributes.displayReadMoreLink && (
					<a href={ post.link } className="o-posts-read-more">
						{ __( 'Read more', 'otter-blocks' ) }
					</a>
				) }
			</div>
		);
	}
	return '';
};

export const PaginationPreview = () => (
	<div className='o-posts-grid-pag'>
		<a className="page-numbers">
			{
				__( 'Prev', 'otter-blocks' )
			}
		</a>
		<a className="page-numbers" aria-current="page">
			{
				__( '1', 'otter-blocks' )
			}
		</a>
		<span className="page-numbers">
			{
				__( '2', 'otter-blocks' )
			}
		</span>
		<a className="page-numbers">
			{
				__( '3', 'otter-blocks' )
			}
		</a>
		<span className="page-numbers dots">
			...
		</span>
		<a className="page-numbers">
			{
				__( '8', 'otter-blocks' )
			}
		</a>
		<a className="page-numbers">
			{
				__( 'Next', 'otter-blocks' )
			}
		</a>
	</div>
);

export default Layout;
