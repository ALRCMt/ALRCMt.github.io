require "yaml"
require "time"
require "date"

module Jekyll
  class SidebarTreeGenerator < Generator
    priority :low

    def generate(site)
      labels = site.config["ordered_collections"] || default_labels(site)
      toc_config = site.config["toc"] || {}
      max_depth = toc_config["sidebar_folder_depth"].to_i
      max_depth = 3 if max_depth <= 0
      tree = {}
      folder_meta_cache = {}

      labels.each do |label|
        docs = docs_for(site, label)
        next if docs.empty?

        tree[label] = build_tree(site, label, docs, max_depth, folder_meta_cache)
      end

      site.data["sidebar_tree"] = tree
    end

    private

    def default_labels(site)
      labels = ["posts"]
      labels.concat(site.collections.keys.sort)
      labels.uniq
    end

    def docs_for(site, label)
      if label == "posts"
        site.posts.docs
      else
        collection = site.collections[label]
        return [] unless collection && collection.metadata["output"]

        collection.docs
      end
    end

    def build_tree(site, label, docs, max_depth, folder_meta_cache)
      root = {
        "docs" => [],
        "folders" => {},
        "path" => "",
        "sort_date" => nil,
      }

      collection_prefix = "_#{label}/"

      docs.each do |doc|
        full_path = (doc.relative_path || doc.path || "").tr("\\", "/")
        relative_path = full_path.sub(/^#{Regexp.escape(collection_prefix)}/, "")
        parts = relative_path.split("/")
        next if parts.empty?

        file_name = parts[-1]
        folder_parts = parts[0...-1]
        folder_parts = folder_parts.first(max_depth)

        node = root
        folder_parts.each_with_index do |folder_name, idx|
          node["folders"][folder_name] ||= begin
            path_parts = folder_parts[0..idx]
            folder_path = path_parts.join("/")
            folder_meta = folder_metadata(site, label, path_parts, folder_meta_cache)
            {
              "name" => folder_name,
              "title" => folder_meta["title"],
              "path" => folder_path,
              "sort_date" => folder_meta["sort_date"],
              "docs" => [],
              "folders" => {},
            }
          end
          node = node["folders"][folder_name]
        end

        node["docs"] << {
          "url" => doc.url,
          "title" => (doc.data["title"] || File.basename(file_name, ".md")),
          "sort_date" => document_sort_date(doc),
        }
      end

      normalize(root)
    end

    def folder_metadata(site, label, path_parts, cache)
      cache_key = [label, *path_parts].join("/")
      return cache[cache_key] if cache.key?(cache_key)

      config_path = File.join(site.source, "_#{label}", *path_parts, "_folder.yml")
      title = path_parts[-1]
      sort_date = nil

      if File.exist?(config_path)
        begin
          data = YAML.safe_load(
            File.read(config_path),
            permitted_classes: [Date, Time],
            aliases: true
          ) || {}
          loaded_title = data["title"]
          title = loaded_title.to_s.strip unless loaded_title.nil? || loaded_title.to_s.strip.empty?
          sort_date = parse_sort_date(data["date"])
        rescue StandardError
          # Keep fallback folder name if config is invalid.
        end
      end

      cache[cache_key] = {
        "title" => title,
        "sort_date" => sort_date,
      }
      cache[cache_key]
    end

    def document_sort_date(doc)
      if doc.respond_to?(:date) && !doc.date.nil?
        parsed_doc_date = parse_sort_date(doc.date)
        return parsed_doc_date unless parsed_doc_date.nil?
      end

      parse_sort_date(doc.data["date"])
    end

    def parse_sort_date(value)
      return nil if value.nil?

      if value.respond_to?(:to_time)
        begin
          return value.to_time
        rescue StandardError
          # Continue to string parsing below.
        end
      end

      value_str = value.to_s.strip
      return nil if value_str.empty?

      Time.parse(value_str)
    rescue StandardError
      nil
    end

    def max_sort_time
      Time.utc(9999, 12, 31)
    end

    def sort_key_for(value)
      (value || max_sort_time).utc.strftime("%Y%m%d%H%M%S")
    end

    def normalize(node)
      fallback_name = node["name"]
      if (fallback_name.nil? || fallback_name.to_s.empty?) && node["path"]
        fallback_name = node["path"].to_s.split("/").last
      end

      sorted_docs = (node["docs"] || []).sort_by do |item|
        [item["sort_date"] || max_sort_time, item["title"].to_s]
      end

      sorted_folders = (node["folders"] || {}).map { |_k, child| normalize(child) }
      sorted_folders.sort_by! do |child|
        [child["sort_date"] || max_sort_time, child["title"].to_s]
      end

      mixed_entries = []
      sorted_folders.each do |folder|
        mixed_entries << folder.merge("kind" => "folder")
      end
      sorted_docs.each do |doc|
        mixed_entries << doc.merge("kind" => "doc")
      end
      mixed_entries.sort_by! do |entry|
        [entry["sort_date"] || max_sort_time, entry["title"].to_s, entry["kind"].to_s]
      end

      {
        "name" => fallback_name,
        "title" => (node["title"] || fallback_name),
        "path" => node["path"],
        "sort_date" => node["sort_date"],
        "docs" => [],
        "folders" => mixed_entries.map do |entry|
          entry.reject { |k, _v| k == "sort_date" }.merge("sort_key" => sort_key_for(entry["sort_date"]))
        end,
        "children" => mixed_entries.map { |entry| entry.reject { |k, _v| k == "sort_date" } },
      }
    end
  end
end
