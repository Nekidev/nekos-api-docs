async function _parseMany(rows, parser) {
    var result = [];

    for (var i = 0; i < rows.length; i++) {
        result.push(await parser(rows[i]));
    }

    return result;
}

export default async function parseImage(
    image,
    file,
    url,
    artist,
    categories,
    characters,
) {
    const imageOrientation = image.width > image.height ? "landscape" : image.width < image.height ? "portrait" : "square";

    return {
        id: image.id,
        url: url,
        artist: await parseArtist(artist),
        source: {
            name: image.source_name,
            url: image.source_url,
        },
        nsfw: image.nsfw,
        categories: await _parseMany(categories, parseCategory),
        characters: await _parseMany(characters, parseCharacter),
        createdAt: image.created_at,
        meta: {
            eTag: file.metadata.eTag,
            size: file.metadata.size,
            mimetype: file.metadata.mimetype,
            dimens: {
                height: image.height,
                width: image.width,
                orientation: imageOrientation
            },
        }
    }
}

export async function parseCharacter(character, prismaClient = null) {
    var imageCount = undefined;

    if (prismaClient) {
        imageCount = await prismaClient.images.count({
            where: {
                characters: {
                    some: {
                        id: character.id,
                    },
                },
            },
        });
    }

    return {
        id: character.id,
        name: character.name,
        description: character.description,
        createdAt: character.created_at,
    }
}

export async function parseCategory(category, prismaClient = null) {
    var imageCount = undefined;

    if (prismaClient) {
        imageCount = await prismaClient.images.count({
            where: {
                categories: {
                    some: {
                        id: category.id,
                    },
                },
            },
        });
    }

    return {
        id: category.id,
        name: category.name,
        description: category.description,
        nsfw: category.nsfw,
        images: imageCount,
        createdAt: category.created_at,
    }
}

export async function parseArtist(artist, prismaClient = null) {
    var imageCount = undefined;

    if (prismaClient) {
        imageCount = await prismaClient.images.count({
            where: {
                artist: artist.id,
            },
        });
    }

    return artist ? {
        id: artist.id,
        name: artist.name,
        url: artist.url,
        images: imageCount,
    } : null
}