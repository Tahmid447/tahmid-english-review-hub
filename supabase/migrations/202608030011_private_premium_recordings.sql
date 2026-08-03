-- Private Premium speaking recordings. Objects are never public; learners can
-- upload only into their own user-id folder and teachers read them through
-- short-lived signed URLs.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'review-premium-recordings',
  'review-premium-recordings',
  false,
  10485760,
  array['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/mpeg']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists review_recordings_select on storage.objects;
create policy review_recordings_select
on storage.objects for select
to authenticated
using (
  bucket_id = 'review-premium-recordings'
  and (
    public.is_review_teacher()
    or (storage.foldername(name))[1] = auth.uid()::text
  )
);

drop policy if exists review_recordings_insert_self on storage.objects;
create policy review_recordings_insert_self
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'review-premium-recordings'
  and (storage.foldername(name))[1] = auth.uid()::text
  and public.review_has_feature('speaking_submission')
);

drop policy if exists review_recordings_delete_safe on storage.objects;
create policy review_recordings_delete_safe
on storage.objects for delete
to authenticated
using (
  bucket_id = 'review-premium-recordings'
  and (
    public.is_review_teacher()
    or (
      (storage.foldername(name))[1] = auth.uid()::text
      and not exists (
        select 1
        from public.review_task_submissions s
        where s.audio_object_path = storage.objects.name
          and s.status not in ('draft', 'returned')
      )
    )
  )
);
