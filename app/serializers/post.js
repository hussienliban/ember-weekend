import Ember from 'ember';
import DS from 'ember-data';

const { $: jQuery } = Ember;

function extractArray(payload) {
  const $posts = toArray(jQuery('article.post', payload));
  const posts = [];

  $posts.forEach((post) => {
    const $post = jQuery('section', post);
    const $aside = jQuery('aside', post);

    const children = toArray($post.children());
    const title = jQuery(children.shift()).text();
    const id = Ember.String.dasherize(title);
    const body = jQuery('<div>').append(children).addClass('post').html();

    const author = $aside.find('li:first b').text();
    const permalink = $aside.find('li:nth(2) a').attr('href').replace(/\-.*/, '');

    if (['jonathanjackson', 'chasemccarthy'].indexOf(author) >= 0) {
      posts.push({ id, title, body, author, permalink });
    }
  });

  return { posts };
}

function toArray(a) {
  return [].map.call(a, i => i);
}

export default DS.RESTSerializer.extend({
  isNewSerializerAPI: true,

  normalizeArrayResponse(store, type, payload) {
    payload = extractArray(payload);
    return this._super(store, type, payload);
  }
});