import { supabase } from './supabase';

export async function trackPageView(url: string, ip: string, userAgent?: string) {
  const { data: visit } = await supabase
    .from('visits')
    .insert({
      ip_address: ip,
      user_agent: userAgent,
      page_url: url
    })
    .select()
    .single();

  return visit;
}

export async function trackMovieView(movieId: number, visitId: string) {
  return supabase
    .from('movie_views')
    .insert({
      movie_id: movieId,
      visit_id: visitId
    });
}

export async function trackCategoryView(categoryId: number, visitId: string) {
  return supabase
    .from('category_views')
    .insert({
      category_id: categoryId,
      visit_id: visitId
    });
}

export async function getMovieStats(days: number) {
  const { data } = await supabase
    .rpc('get_movie_stats', { days_ago: days });
  return data;
}

export async function getCategoryStats(days: number) {
  const { data } = await supabase
    .rpc('get_category_stats', { days_ago: days });
  return data;
}

export async function getVisitorStats(days: number) {
  const { data } = await supabase
    .rpc('get_visitor_stats', { days_ago: days });
  return data;
}