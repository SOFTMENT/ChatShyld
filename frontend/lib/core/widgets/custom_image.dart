import 'package:cached_network_image/cached_network_image.dart';
import 'package:chatshyld/core/services/image_service.dart';
import 'package:flutter/material.dart';

class CustomImage extends StatelessWidget {
  const CustomImage({
    super.key,
    required this.imageKey,

    this.imageFullUrl,
    this.borderRadius = 1000,
    this.boxFit = BoxFit.cover,
  });
  final String? imageKey;

  final BoxFit boxFit;
  final String? imageFullUrl;
  final double borderRadius;
  @override
  Widget build(BuildContext context) {
    return ((imageKey == null || imageKey!.isEmpty) &&
            (imageFullUrl == null || imageFullUrl!.isEmpty))
        ? ClipRRect(
            borderRadius: BorderRadius.circular(borderRadius),
            child: Image.asset('assets/images/imageload.gif', fit: boxFit),
          )
        : ClipRRect(
            borderRadius: BorderRadius.circular(borderRadius),
            child: CachedNetworkImage(
              imageUrl: imageFullUrl != null && imageFullUrl!.isNotEmpty
                  ? imageFullUrl!
                  : ImageService.generateImageUrl(imagePath: imageKey!),

              fit: boxFit,
              errorWidget: (context, url, error) {
                return Image.asset('assets/images/imageload.gif', fit: boxFit);
              },
              placeholder: (context, url) =>
                  Image.asset('assets/images/imageload.gif', fit: boxFit),
            ),
          );
  }
}
